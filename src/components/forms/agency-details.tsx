/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useToast } from "@/hooks/use-toast";
import { Agency } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import FileUpload from "../global/file-upload";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { NumberInput } from "@tremor/react";
import { deleteAgency, initUser, saveActivityLogsNotification, updateAgencyDetails, upsertAgency } from "@/lib/queries";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { v4 } from "uuid";

type AgencyDetailsProps = {
  data?: Partial<Agency>;
};

const FormSchema = z.object({
  name: z.string().min(2, { message: "O nome da agencia deve ter pelo menos 2 caracteres." }),
  companyEmail: z.string().min(1),
  companyPhone: z.string().min(1),
  whiteLabel: z.boolean(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  agencyLogo: z.string().min(1),
});

const AgencyDetails = ({ data }: AgencyDetailsProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState<boolean>(false);
  const [goal, setGoal] = useState<number>(data?.goal || 0);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name || "",
      companyEmail: data?.companyEmail || "",
      companyPhone: data?.companyPhone || "",
      whiteLabel: data?.whiteLabel || false,
      address: data?.address || "",
      city: data?.city || "",
      zipCode: data?.zipCode || "",
      state: data?.state || "",
      country: data?.country || "",
      agencyLogo: data?.agencyLogo || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      let customerId;
      if (!data?.id) {
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.zipCode,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.zipCode,
          },
        };
      }
      //WIP custId
      const newUserData = await initUser({ role: "AGENCY_OWNER" });
      if (!data?.id) {
        await upsertAgency({
          id: data?.id ? data.id : v4(),
          // customerId: data?.customerId,
          address: values.address,
          agencyLogo: values.agencyLogo,
          city: values.city,
          companyPhone: values.companyPhone,
          country: values.country,
          name: values.name,
          state: values.state,
          whiteLabel: values.whiteLabel,
          zipCode: values.zipCode,
          createdAt: new Date(),
          updatedAt: new Date(),
          companyEmail: values.companyEmail,
          connectAccountId: "",
          goal: 5,
        });
        toast({
          title: "Agencia criada com sucesso!",
        });

        return router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Oops!",
        description: "Ocorreu um erro ao criar a agência",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency(true);
    //descontinue the subscription

    try {
      const response = await deleteAgency(data.id);
      toast({
        title: "Agência deletada com sucesso",
        description: "A agência foi deletada com sucesso",
        variant: "default",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Ocorreu um erro ao deletar a agência",
        variant: "destructive",
      });
    }
    setDeletingAgency(false);
  };

  return (
    <AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>Informações da Agencia</CardTitle>
          <CardDescription>
            Vamos criar uma agencia para o seu negócio. Você pode editar as informações depois na tela de configurações.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload apiEndpoint="agencyLogo" onChange={field.onChange} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Nome da Agência</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da agência" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyPhone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Telefone da Agência</FormLabel>
                      <FormControl>
                        <Input placeholder="Telefone" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled={isLoading}
                control={form.control}
                name="whiteLabel"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                      <div>
                        <FormLabel>Agência Whitelabel</FormLabel>
                        <FormDescription>
                          Ativando o modo whitelabel, o logo da agência será exibido em todos os sub contas por padrão. Você pode
                          sobrescrever essa funcionalidade através das configurações do sub conta.
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua 123..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Estado" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="CEP" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input placeholder="País" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {data?.id && (
                <div className="flex flex-col gap-2">
                  <FormLabel>Crie um objetivo</FormLabel>
                  <FormDescription>
                    ✨ Crie um objetivo para a sua agência. Assim que você atingir o objetivo, você receberá uma notificação.
                  </FormDescription>
                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={(val: any) => {
                      if (!data?.id) return;
                      // Armazene o valor em um estado local
                      setGoal(val);
                    }}
                    min={1}
                    className="bg-background !border !border-input"
                    placeholder="Objetivo de sub contas"
                  />
                  <Button
                    onClick={async () => {
                      if (!data?.id) return;
                      await updateAgencyDetails(data.id, { goal });
                      await saveActivityLogsNotification({
                        agencyId: data.id,
                        description: `Atualizando agência com o objetivo de ${goal} sub contas`,
                        subaccountId: undefined,
                      });
                      router.refresh();
                    }}
                  >
                    Salvar Objetivo
                  </Button>
                </div>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Salvar informações"}
              </Button>
            </form>
          </Form>
          {data?.id && (
            <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
              <div>
                <div>Danger Zone</div>
              </div>
              <div className="text-muted-foreground">
                A exclusão da sua agência não pode ser desfeita. Isso também deletará todas as sub contas e todos os dados relacionados às
                suas sub contas. As sub contas não terão mais acesso a funis, contatos etc.
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deletingAgency}
                className="text-red-600 p-2 text-center mt-2 rounded-md hove:bg-red-600 hover:text-white whitespace-nowrap"
              >
                {deletingAgency ? "Deleting..." : "Delete Agency"}
              </AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete the Agency account and all related sub accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={deletingAgency} className="bg-destructive hover:bg-destructive" onClick={handleDeleteAgency}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetails;
